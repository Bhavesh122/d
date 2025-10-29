package com.rwtool.service;

import com.rwtool.model.UserGroup;
import com.rwtool.repository.UserGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserGroupService {

    @Autowired
    private UserGroupRepository userGroupRepository;

    public List<UserGroup> getAllGroups() {
        return userGroupRepository.findAll();
    }

    public Optional<UserGroup> getGroupById(Long id) {
        return userGroupRepository.findById(id);
    }

    public Optional<UserGroup> getGroupByName(String adGroupName) {
        return userGroupRepository.findByAdGroupName(adGroupName);
    }

    public Optional<UserGroup> getGroupByDomain(String domain) {
        return userGroupRepository.findByAssociatedDomain(domain);
    }

    public List<UserGroup> getGroupsByUserEmail(String email) {
        return userGroupRepository.findByMemberEmail(email);
    }

    @Transactional
    public UserGroup createGroup(UserGroup group) {
        // Check if group with same name already exists
        Optional<UserGroup> existing = userGroupRepository.findByAdGroupName(group.getAdGroupName());
        if (existing.isPresent()) {
            throw new RuntimeException("User group with name '" + group.getAdGroupName() + "' already exists");
        }
        
        group.setCreatedDate(LocalDateTime.now());
        group.setUpdatedDate(LocalDateTime.now());
        return userGroupRepository.save(group);
    }

    @Transactional
    public UserGroup updateGroup(Long id, UserGroup updatedGroup) {
        UserGroup group = userGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User group not found with id: " + id));
        
        group.setAdGroupName(updatedGroup.getAdGroupName());
        group.setAssociatedDomain(updatedGroup.getAssociatedDomain());
        group.setFolderAccess(updatedGroup.getFolderAccess());
        group.setMembers(updatedGroup.getMembers());
        group.setUpdatedDate(LocalDateTime.now());
        
        return userGroupRepository.save(group);
    }

    @Transactional
    public void deleteGroup(Long id) {
        userGroupRepository.deleteById(id);
    }

    /**
     * Add a user to a group by domain name
     * This is called when admin approves a subscription request
     */
    @Transactional
    public void addUserToGroupByDomain(String userEmail, String domainName) {
        Optional<UserGroup> groupOpt = userGroupRepository.findByAssociatedDomain(domainName);
        
        if (groupOpt.isPresent()) {
            UserGroup group = groupOpt.get();
            if (!group.getMembers().contains(userEmail)) {
                group.getMembers().add(userEmail);
                group.setUpdatedDate(LocalDateTime.now());
                userGroupRepository.save(group);
            }
        } else {
            // If no group exists for this domain, create one automatically
            UserGroup newGroup = new UserGroup();
            newGroup.setAdGroupName(domainName + " Users");
            newGroup.setAssociatedDomain(domainName);
            newGroup.getMembers().add(userEmail);
            // Add the domain folder to folder access
            newGroup.getFolderAccess().add(domainName);
            userGroupRepository.save(newGroup);
        }
    }

    /**
     * Remove a user from a group
     */
    @Transactional
    public void removeUserFromGroup(Long groupId, String userEmail) {
        UserGroup group = userGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("User group not found with id: " + groupId));
        
        group.getMembers().remove(userEmail);
        group.setUpdatedDate(LocalDateTime.now());
        userGroupRepository.save(group);
    }

    /**
     * Get all folders accessible by a user (based on their group memberships)
     */
    public List<String> getUserAccessibleFolders(String userEmail) {
        List<UserGroup> userGroups = userGroupRepository.findByMemberEmail(userEmail);
        return userGroups.stream()
                .flatMap(group -> group.getFolderAccess().stream())
                .distinct()
                .sorted()
                .toList();
    }
}
